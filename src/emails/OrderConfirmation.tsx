import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Column,
  Row,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface LineItem {
  productName: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
  orderId: string;
  items: LineItem[];
  totalAmount: number;
  currency: string;
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#0e7490",
};

const text = {
  color: "#52525b",
  fontSize: "16px",
  lineHeight: "26px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footerText = {
  color: "#888888",
  fontSize: "12px",
};

export default function OrderConfirmationEmail({
  orderId,
  items,
  totalAmount,
  currency,
}: OrderConfirmationEmailProps) {
  const formattedTotal = totalAmount.toFixed(2);
  const currencyUpper = currency.toUpperCase();

  return (
    <Html>
      <Head />
      <Preview>Your MiniCom Order #{orderId.substring(0, 8)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your Order is Confirmed!</Heading>
          <Text style={text}>
            Thank you for your purchase. We&apos;ve received your order and are
            getting it ready.
          </Text>
          <Text style={{ ...text, fontWeight: "bold" }}>
            Order ID: #{orderId.substring(0, 8)}
          </Text>

          <Hr style={hr} />

          {items.map((item, index) => (
            <Row key={index}>
              <Column>
                <Text style={text}>
                  {item.productName} (x{item.quantity})
                </Text>
              </Column>
              <Column align="right">
                <Text style={text}>
                  {(item.price * item.quantity).toFixed(2)} {currencyUpper}
                </Text>
              </Column>
            </Row>
          ))}

          <Hr style={hr} />

          <Row>
            <Column>
              <Text style={{ ...text, fontWeight: "bold" }}>Total</Text>
            </Column>
            <Column align="right">
              <Text style={{ ...text, fontWeight: "bold" }}>
                {formattedTotal} {currencyUpper}
              </Text>
            </Column>
          </Row>

          <Hr style={hr} />

          <Text style={footerText}>MiniCom, 123 Commerce St, Web City.</Text>
        </Container>
      </Body>
    </Html>
  );
}
