"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/utils/services";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "title must be at least 10 characters.",
  }),
  description: z.string().optional(),
  prompt: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  service: z.string(),
});

const CreatePage = () => {
  const { data: user, isLoading: isUser } = useCurrentUser();

  if (isUser) return <div>Loading...</div>;

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      service: "ChatGPT",
      title: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // .then(() => {})
    setIsLoading(true);
    axios
      .post("/api/prompt/create", {
        ...data,
        userId: user.id,
      })
      .then((data) => {
        if (data.status === 200) {
          toast.success("Prompt created!");
          router.push("/");
        } else {
          toast.error("Error went!");
        }
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Prompt for OpenAI Chat GPT"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Prompt is for which service</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder="Write me a letter to boss"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder="This prompt is about"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default CreatePage;