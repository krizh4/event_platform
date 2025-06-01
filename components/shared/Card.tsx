import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'

type CardProps = {
    event: IEvent,
    hasOrderLink?: boolean,
    hidePrice?: boolean,

}

const Card = async ({event, hasOrderLink, hidePrice}: CardProps) => {

    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId as string;

    const isEventCreator = event?.organizer?._id.toString() === userId

    console.log(sessionClaims);

    console.log(userId, event?.organizer?._id.toString(), isEventCreator);

  return (
    <div className='group flex relative min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg md:min-h-[438px]'>
        <Link 
            href={`/events/${event._id}`} 
            style={{backgroundImage: `url(${event?.imageUrl})`}}
            className='flex-center flex-grow bg-gray-500 bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out group-hover:scale-105'
        />
        
        {isEventCreator && !hidePrice && (
            <div className='absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all'>
                <Link href={`/events/${event._id}/update`} >
                    <Image 
                        src='/assets/icons/edit.svg'
                        alt='edit-icon'
                        width={20}
                        height={20}
                        className='h-4 w-4 text-gray-500 transition-all'
                    />
                </Link>

                <DeleteConfirmation eventId={event._id} />
            </div>
        )}

        <div  
            className='flex min-h-[230px] flex-col gap-3 p-5 md:gap-4'
        >
            { !hidePrice && <div className='flex gap-2 '>
                <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600'>
                    {event?.isFree ? "FREE" : `$${event?.price}`}
                </span>
                <p className='p-semibold-14 w-min rounded-full bg-gray-100 px-4 py-1 text-gray-500 line-clamp-1'>
                    {event?.category?.name}
                </p>
            </div> }

            <p className='p-medium-16 p-medium-18 text-gray-500'>
                {formatDateTime(event?.startDateTime).dateTime}
            </p>

            <p className='p-medium-16 md:p-medium-20 text-gray-800 line-clamp-2 flex-1'>
                {event?.title.length > 50 ? `${event?.title.slice(0, 50)}...` : event?.title}
            </p>

            <div className='flex-between w-full '>
                <p className='p-medium-14 md:p-medium-16 text-gray-600'>
                    {event?.organizer?.firstName} {event?.organizer?.lastName}
                </p>
                {hasOrderLink && (
                    <Link href={`/orders?eventId=${event?._id}`} 
                    className='flex gap-2'>
                        <p className='text-primary-500'>Order Details</p>
                        <Image 
                            src='/assets/icons/arrow.svg'
                            alt='arrow-right'
                            width={10}
                            height={10}
                            // className='h-4 w-4 text-primary-500 transition-all duration-300 ease-in-out group-hover:translate-x-1'

                        />
                    </Link>

                )}
            </div>

        </div>

    </div>
  )
}

export default Card