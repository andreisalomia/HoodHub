import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from 'lucide-react'

export default function PricingPlanPage() {
    const plans = [
        {
            name: "Starter",
            price: "$0",
            description: "For individuals just getting started",
            features: ["Create up to 10 events", "Basic analytics", "Email support"],
        },
        {
            name: "Pro",
            price: "$29",
            description: "For growing businesses",
            features: ["Unlimited events", "Advanced analytics", "Priority support", "Custom branding"],
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large-scale operations",
            features: ["Unlimited events", "Advanced analytics", "Dedicated support", "Custom integrations", "SLA"],
        },
    ]

    return (
        <div className="min-h-screen w-full bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Upgrade Your Plan
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        You've reached the limit of 10 events on your current plan. Upgrade to create unlimited events and unlock more features.
                    </p>
                </div>
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.name} className="flex flex-col justify-between">
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                                <CardDescription className="text-sm">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-base font-medium text-gray-500">/month</span>}
                                </div>
                                <ul className="mt-6 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <Check className="h-6 w-6 text-green-500" />
                                            </div>
                                            <p className="ml-3 text-base text-gray-700">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                                    {plan.price === "Custom" ? "Contact Sales" : "Upgrade Now"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

