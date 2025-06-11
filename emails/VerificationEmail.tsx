import {
    Html,
    Head,
    Font,
    Preview,
    Row,
    Section,
    Text,
    Heading
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html>
            <Head>
                <title>Verification Email</title>
                <Font
                    fontFamily="Arial"
                    fallbackFontFamily="sans-serif"
                />
            </Head>
            <Preview>Verify your account with the OTP provided</Preview>
            <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
                <Row>
                    <Heading style={{ color: '#333' }}>
                        Hello {username},
                    </Heading>
                </Row>
                <Row>
                    <Text style={{ color: '#555' }}>
                        Your verification code is: <strong>{otp}</strong>
                    </Text>
                </Row>
                <Row>
                    <Text style={{ color: '#555' }}>
                        Please use this code to verify your account.
                    </Text>
                </Row>
            </Section>
        </Html>
    );

}