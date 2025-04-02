"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ReCaptcha } from "@/components/ui/recaptcha";
import { submitContactForm } from "@/lib/actions/contact-form-actions";
import {
  ContactFormData,
  consultationAreas,
  contactFormSchema,
} from "@/lib/schemas/contact-form-schema";

export function ContactForm() {
  // Form state management with react-hook-form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: "",
      name: "",
      email: "",
      message: "",
      requestConsultation: false,
      consultationAreas: [],
      otherConsultationArea: "",
      honeypot: "",
      recaptchaToken: "",
    },
    mode: "onChange",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Handle reCAPTCHA verification
  const handleRecaptchaVerify = (token: string) => {
    form.setValue("recaptchaToken", token);
  };

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitContactForm(data);
      setSubmitResult(result);

      if (result.success) {
        form.reset();
      }
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get consultation request value for conditional rendering
  const requestsConsultation = form.watch("requestConsultation");

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Submission status message */}
      {submitResult && (
        <div
          className={cn(
            "mb-6 p-4 rounded-md text-center text-sm",
            submitResult.success
              ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
          )}
        >
          {submitResult.message}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden from users, but visible to bots */}
          <div className="absolute opacity-0 pointer-events-none">
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave this empty</FormLabel>
                  <FormControl>
                    <Input {...field} tabIndex={-1} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Subject field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What is your inquiry about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your email will only be used to respond to your inquiry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about your inquiry..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consultation request checkbox */}
          <FormField
            control={form.control}
            name="requestConsultation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Request Consultation</FormLabel>
                  <FormDescription>
                    Check this if you&apos;re interested in consulting services.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Consultation areas - conditional based on requestConsultation checkbox */}
          {requestsConsultation && (
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
              <div className="font-medium">Consultation Areas:</div>
              <FormField
                control={form.control}
                name="consultationAreas"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {consultationAreas.map((area) => (
                        <FormField
                          key={area}
                          control={form.control}
                          name="consultationAreas"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={area}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area)}
                                    onCheckedChange={(checked: boolean) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          area,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== area
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {area}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Other consultation area - conditional based on "Other" being selected */}
              {form.watch("consultationAreas")?.includes("Other") && (
                <FormField
                  control={form.control}
                  name="otherConsultationArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Area (please specify)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Specify other consultation area"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {/* reCAPTCHA component */}
          <ReCaptcha onVerify={handleRecaptchaVerify} />

          <Separator className="my-6" />

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
