import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PrepeerMagicLinkEmailProps {
  verifyCode?: string;
}

const baseUrl = 'https://prepeer.app'

export const PrepeerMagicLinkEmail = ({
  verifyCode,
}: PrepeerMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>你的 Prepeer 驗證連結</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>登入</Heading>
        <Link
          href={`https://prepeer.app/verify/${verifyCode}`}
          target="_blank"
          style={{
            ...link,
            display: "block",
            marginBottom: "16px",
          }}
        >
         點擊連結完成驗證 ( 15 分鐘後過期 )
        </Link>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          如果你沒有註冊 Prepeer.app 帳號，請忽略這封電子郵件
        </Text>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "12px",
            marginBottom: "38px",
          }}
        >
          Hint: 如果你的連結過期，只需重新註冊一次 Prepeer 帳號即可取得新驗證連結
        </Text>
        <Img
          src={`${baseUrl}/prepeer-logo.png`}
          width="32"
          height="32"
          alt="Prepeer's Logo"
        />
        <Text style={footer}>
          <Link
            href="https://prepeer.app"
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            Prepeer.app
          </Link>
          , 用 AI 幫你練習面試
        </Text>
      </Container>
    </Body>
  </Html>
);

PrepeerMagicLinkEmail.PreviewProps = {
  loginCode: "sparo-ndigo-amurt-secan",
} as PrepeerMagicLinkEmailProps;

export default PrepeerMagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
