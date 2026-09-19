package com.example.AgriConnect.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendPasswordResetMail(
            String email,
            String otp
    ) {

        String resetLink =
                frontendUrl + "/reset-password?email=" + email;


        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("AgriConnect Password Reset");

        message.setText(
                "Hello,\n\n"
                        + "Your OTP is: "
                        + otp
                        + "\n\n"
                        + "Reset Password Link:\n"
                        + resetLink
                        + "\n\n"
                        + "OTP valid for 5 minutes."
        );


        mailSender.send(message);
    }

    public void sendVerificationMail(String email, String token) {

        String verifyLink = frontendUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Verify your AgriConnect email");
        message.setText(
                "Hello,\n\n"
                        + "Please verify your email address by clicking the link below:\n"
                        + verifyLink
                        + "\n\n"
                        + "This link is valid for 24 hours."
        );

        mailSender.send(message);
    }
}
