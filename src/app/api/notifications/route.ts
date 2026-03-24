import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const unreadCount = await prisma.notification.count({
    where: { userId: session.id, isRead: false },
  })

  return NextResponse.json({ notifications, unreadCount })
}

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
  }

  const { notificationIds } = await request.json()

  if (notificationIds && Array.isArray(notificationIds)) {
    await prisma.notification.updateMany({
      where: { id: { in: notificationIds }, userId: session.id },
      data: { isRead: true },
    })
  } else {
    // Mark all as read
    await prisma.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    })
  }

  return NextResponse.json({ success: true })
}
