import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
import { checkRateLimit } from '@/lib/rate-limit'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret'
)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimit = checkRateLimit(`login:${ip}`, { maxRequests: 5, windowMs: 60 * 1000 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: 'Trop de tentatives. Veuillez réessayer dans une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const body = await request.json()

    // Honeypot check
    if (body.website) {
      return NextResponse.json(
        { message: 'Requête invalide' },
        { status: 400 }
      )
    }

    // Validate input
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Identifiants invalides', errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { message: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    // Create JWT
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        competence: user.competence,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
