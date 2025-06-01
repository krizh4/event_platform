import { IEvent } from '@/lib/database/models/event.model'
import React from 'react'
import { Button } from '../ui/button'

const Checkout = ({event, userId}: {event: IEvent, userId:String}) => {
  const onCheckout = async () => {}
  
    return (
    <form action={onCheckout}>
      <Button type='submit' id='payhere-payment' role='link' size='lg' className='button sm:w-fit'>
        {event?.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>

    </form>
  )
}

export default Checkout