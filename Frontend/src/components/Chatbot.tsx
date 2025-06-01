import React from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f3f4f6", // Tailwind gray-100
  fontFamily: "Arial",
  headerBgColor: "#1f2937", // Tailwind gray-800
  headerFontColor: "#ffffff",
  headerFontSize: "16px",
  botBubbleColor: "#1f2937",
  botFontColor: "#ffffff",
  userBubbleColor: "#e5e7eb",
  userFontColor: "#000000",
};

type ProcessInputProps = {
  previousStep: {
    message?: string;
  };
};

const ProcessInput: React.FC<ProcessInputProps> = (props) => {
  const message = props.previousStep?.message ?? "";
  const input = message.toLowerCase();

  if (!input) {
    return <div>Sorry, I didn't get your input. Please try again.</div>;
  }

  if (input.includes("price")) {
    return (
      <div>
        💰 Our prices start from $30/day. Prices vary by car type and rental duration.
      </div>
    );
  }
  if (input.includes("car")) {
    return (
      <div>
        🚗 You can view our available cars on the{" "}
        <a href="/cars" className="text-blue-600 underline" target="_blank" rel="noreferrer">
          Cars page
        </a>
        .
      </div>
    );
  }
  if (input.includes("requirement")) {
    return (
      <div>
        🪪 To rent a car, you need a valid license, national ID, and be over 21 years old.
      </div>
    );
  }
  if (input.includes("contact")) {
    return (
      <div>
        📞 You can reach us on our{" "}
        <a href="/contact" className="text-blue-600 underline" target="_blank" rel="noreferrer">
          Contact page
        </a>
        .
      </div>
    );
  }

  return <div>Sorry, I didn't understand that. Please try one of the options below.</div>;
};

const steps = [
  {
    id: "1",
    message: "👋 Welcome to FastRide Car Rental! How can I assist you today?",
    trigger: "ask-input",
  },
  {
    id: "ask-input",
    message: "Please type your question or choose an option below:",
    trigger: "user-input",
  },
  {
    id: "user-input",
    user: true,
    trigger: "process-input",
  },
  {
    id: "process-input",
    component: ProcessInput, // pass component, NOT <ProcessInput />
    asMessage: true,
    trigger: "options-after-input",
  },
  {
    id: "options-after-input",
    options: [
      { value: "cars", label: "View available cars", trigger: "cars" },
      { value: "price", label: "Rental prices", trigger: "prices" },
      { value: "requirements", label: "What do I need to rent?", trigger: "requirements" },
      { value: "contact", label: "Contact the agency", trigger: "contact" },
    ],
  },
  {
    id: "cars",
    message: "🚗 You can view our available cars on the Cars page.",
    trigger: "cars-link",
  },
  {
    id: "cars-link",
    component: (
      <a
        href="/cars"
        className="text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        👉 Go to Cars Page
      </a>
    ),
    end: true,
  },
  {
    id: "prices",
    message:
      "💰 Our prices start from $30/day. Prices vary based on car type and rental duration.",
    end: true,
  },
  {
    id: "requirements",
    message:
      "🪪 To rent a car, you need a valid driving license, national ID, and must be over 21 years old.",
    end: true,
  },
  {
    id: "contact",
    message: "📞 You can reach us through our Contact page.",
    trigger: "contact-link",
  },
  {
    id: "contact-link",
    component: (
      <a
        href="/contact"
        className="text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        👉 Go to Contact Page
      </a>
    ),
    end: true,
  },
];

const Chatbot = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ThemeProvider theme={theme}>
        <ChatBot steps={steps} headerTitle="FastRide Assistant" floating={true} />
      </ThemeProvider>
    </div>
  );
};

export default Chatbot;
