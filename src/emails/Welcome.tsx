import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name?: string | null;
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
  color: "#0e7490", // cyan-700 from tailwind
};

const text = {
  margin: "24px 0",
  color: "#52525b", // stone-600 from tailwind
  fontSize: "16px",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#0e7490", // cyan-700
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
};

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  const userGreeting = name ? ` ${name}` : "";

  return (
    <Html>
      <Head />
      <Preview>Welcome to MiniCom!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to MiniCom!</Heading>
          <Text style={text}>
            Hi{userGreeting}, thanks for signing up. We're excited to have you
            on board.
          </Text>
          <Button
            style={button}
            href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
          >
            Go to Store
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
