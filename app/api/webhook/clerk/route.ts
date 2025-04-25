import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { clerkClient } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type
    
    if (eventType === 'user.created') {
        const {id, email_addresses, image_url, first_name, last_name, username} = evt.data
        console.log(`User created with ID: ${id}`)

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            photo: image_url,
            firstName: first_name || '',
            lastName: last_name || '',
            username: username || '',
        }

        const newUser = await createUser(user)

        if (newUser) {
            await (await clerkClient()).users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id,
                }
            })
        }

        return NextResponse.json({ message: 'OK, User Created!', user: newUser })
    }
    
    if (eventType === 'user.updated') {
        const {id, image_url, first_name, last_name, username} = evt.data
        console.log(`User created with ID: ${id}`)

        const user = {
            photo: image_url,
            firstName: first_name!,
            lastName: last_name!,
            username: username!,
        }

        const updatedUser = await updateUser(id, user);

        return NextResponse.json({ message: 'OK, User Updated!', user: updatedUser })
    }

    if (eventType === 'user.deleted') {

        const { id } = evt.data
        console.log(`User created with ID: ${id}`)

        const deletedUser = await deleteUser(id!);

        if (!deletedUser) {
            throw new Error("User deletion failed");
        }

        return NextResponse.json({ message: 'OK, User Deleted!', user: deletedUser })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}