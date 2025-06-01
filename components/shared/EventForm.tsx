"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "@/components/ui/checkbox";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
};

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const intialValues = event && type === 'Update' 
  ? {...event, startDateTime: new Date(event.startDateTime), endDateTime: new Date(event.endDateTime)}
  : eventDefaultValues;

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  // 1. Define your form.
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: intialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    const eventData = values;

    let uploadedImageUrl = values.imageUrl;

    if ( files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) {
        return;
      }

      uploadedImageUrl = uploadedImages[0].ufsUrl;
    }

    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: {...values, imageUrl: uploadedImageUrl},
          userId,
          path: '/profile'
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: {...values, imageUrl: uploadedImageUrl, _id: eventId},
          path: `/events/${eventId}`
        });

        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Event Title"
                    {...field}
                    className="bg-gray-50 h-[54px] focus-visible:ring-offset-0 placeholder:text-gray-500 rounded-full p-regular-16 px-4 py-3 border-none focus-visible:ring-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="bg-gray-50 flex flex-1 placeholder:text-gray-500 p-regular-16 px-5 py-3 border-none focus-visible:ring-transparent rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full bg-gray-50 rounded-xl">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] gap-2 w-full overflow-hidden rounded-xl bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="Location"
                      width={24}
                      height={24}
                    />
                    <Input
                      placeholder="Event Location or Online"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] gap-2 w-full overflow-hidden rounded-xl bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="Calender"
                      width={24}
                      height={24}
                      className="filter-gray"
                    />
                    <p className="ml-2 whitespace-nowrap text-gray-500">
                      Start Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat={"MMMM d, yyyy h:mm aa"}
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] gap-2 w-full overflow-hidden rounded-xl bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="Calender"
                      width={24}
                      height={24}
                      className="filter-gray"
                    />
                    <p className="ml-2 whitespace-nowrap text-gray-500">
                      End Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat={"MMMM d, yyyy h:mm aa"}
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] gap-2 w-full overflow-hidden rounded-xl bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="Dollar"
                      width={24}
                      height={24}
                      className="filter-gray"
                    />
                    <Input
                      placeholder="Price"
                      {...field}
                      className="input-field p-regular-16 border-0 bg-gray-50 outline-offset-0 focus:border-none focus-ring-0 focus-visible:ring-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="ml-2 whitespace-nowrap text-gray-500 whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                id="isFree"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                <div className="flex-center h-[54px] gap-2 w-full overflow-hidden rounded-xl bg-gray-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="Dollar"
                      width={24}
                      height={24}
                      className="filter-gray"
                    />
                    <Input
                      placeholder="URL"
                      {...field}
                      className="input-field p-regular-16 border-0 bg-gray-50 outline-offset-0 focus:border-none focus-ring-0 focus-visible:ring-0"
                    />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
        type="submit"
        size="lg"
        disabled={form.formState.isSubmitting}
        className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            "Submitting..." 
          ): (
            `${type === "Create" ? "Create Event" : "Update Event"}`
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
