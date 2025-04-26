import { useContext, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/AuthContext'

export function withAuth<P extends {}>(
  WrappedComponent: NextPage<P>,
  allowedRoles: string[]
): NextPage<P> {
  const Protected: NextPage<P> = (props: P) => {
    const { member } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
      if (member === null) {
        router.replace('/login')
      } else if (!allowedRoles.includes(member.role)) {
        router.replace('/forbidden')
      }
    }, [member, router])

    if (!member || !allowedRoles.includes(member.role)) {
      return <p>Loading…</p>
    }

    return <WrappedComponent {...props} />
  }

  return Protected
}
