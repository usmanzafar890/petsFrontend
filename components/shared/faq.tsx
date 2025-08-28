import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is the cost of the platform?",
    answer:
      "Our platform offers a comprehensive free plan that covers all the essential features for pet care. We also have premium plans with advanced features for professional use.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security very seriously. All your information is encrypted and stored securely. We are compliant with GDPR and other privacy regulations.",
  },
  {
    question: "Can I use the platform for multiple pets?",
    answer:
      "Absolutely. You can manage an unlimited number of pets with a single account. Each pet will have its own dedicated profile and records.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, our platform is available as a mobile app for both iOS and Android devices, allowing you to manage your pet's care on the go.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our platform. If you can't
            find what you're looking for, feel free to contact us.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

