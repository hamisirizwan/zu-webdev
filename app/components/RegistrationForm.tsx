"use client";

import { useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, BookOpen, Rocket } from "lucide-react";
import { register } from "@/actions/register";

export default function RegistrationForm() {
  const handleClick = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const [formData, setFormData] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    whatsappNumber: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    admissionNumber: "",
    email: "",
    whatsappNumber: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    {
      name: "beginner",
      icon: Code,
      title: "Beginner",
      description: "Starting your web dev journey",
      benefit:
        "In this group, we will focus more on basic concepts of web develpments i.e HTML, CSS and Javascript to give the the foundational building blocks for web development.",
    },
    {
      name: "intermediate",
      icon: BookOpen,
      title: "Intermediate",
      description: "Expanding your skills",
      benefit:
        "In this group, we will focus more on advanced Javascript concepts and introduction to web frameworks like react js. You will require basic knowledge of HTML , CSS AND Javascript",
    },
    {
      name: "advanced",
      icon: Rocket,
      title: "Advanced",
      description: "Project-based learning",
      benefit:
        "Here we will focus more on building projects to perfect your skills as well as coming up with collaborating Saas ideas that can potentially be monetized.",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prevData) => ({
      ...prevData,
      category,
    }));
    validateField("category", category);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        error = value.trim() ? "" : "Name is required";
        break;
      case "admissionNumber":
        error = value.trim() ? "" : "Admission number is required";
        break;
      case "email":
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "whatsappNumber":
        const phoneRegex = /^(\+254|0|254)?(7|1)([0-9]{8})$/;
        error = phoneRegex.test(value) ? "" : "Invalid Kenyan phone number";
        break;
      case "category":
        error = value ? "" : "Please select a category";
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formFields = [
      "name",
      "admissionNumber",
      "email",
      "whatsappNumber",
      "category",
    ];
    formFields.forEach((field) =>
      validateField(field, formData[field as keyof typeof formData])
    );

    if (Object.values(errors).every((error) => error === "")) {
      setIsSubmitting(true);
      try {
        const result = await register(formData);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Registration Successfull");
          handleClick();
          setFormData({
            name: "",
            admissionNumber: "",
            email: "",
            whatsappNumber: "",
            category: "",
          });
          setErrors({
            name: "",
            admissionNumber: "",
            email: "",
            whatsappNumber: "",
            category: "",
          });
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-primary">
        Zetech Web Development Club Registration
      </h2>

      <p className="text-lg text-center mb-4">
        Please select a category that best fits your expertise:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-8">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
              formData.category === category.name
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => handleCategorySelect(category.name)}
          >
            <category.icon className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
      {errors.category && (
        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
      )}

      {formData.category ? (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-primary font-medium">
            {categories.find((c) => c.name === formData.category)?.benefit}
          </p>
        </div>
      ):
      (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-primary font-medium">
           Select category to view the details here.
          </p>
        </div>
      )
      }

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="admissionNumber">Admission Number</Label>
            <Input
              id="admissionNumber"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            {errors.admissionNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.admissionNumber}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              type="tel"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            {errors.whatsappNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatsappNumber}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
