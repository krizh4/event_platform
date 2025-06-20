import { IEvent } from '@/lib/database/models/event.model'
import React from 'react'
import Card from './Card'

type CollectionProps = {
    data: IEvent[],
    emptyTitle: string,
    emptyStateSubtext: string,
    limit: number,
    collectionType?: "Events_Organized" | "My_Tickets" | "All_Events",
    page: number | string,
    totalPages?: number,
    urlParamName?: string,
}

const Collection = ({
    data,
    emptyTitle,
    emptyStateSubtext,
    limit,
    collectionType,
    page,
    totalPages,
    urlParamName,
}: CollectionProps) => {
    
  return (
    <>
      {data?.length > 0 ? (
        <div className='flex flex-col items-center gap-10'>
          <ul className='grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-10'>
            {data?.map((event: IEvent) => {
              const hasOrderLink = collectionType === 'Events_Organized'
              const hidePrice = collectionType === 'My_Tickets'

              return (
                <li key={event._id} className='flex justify-center'>
                  <Card event={event} hasOrderLink={hasOrderLink} hidePrice={hidePrice}/>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className='flex flex-center wrapper min-h-[200px] flex-col w-full gap-3 rounded-[14px] bg-gray-50 py-28 text-center'>
          <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
          <p className='p-regular-14'>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  )
}

export default Collection