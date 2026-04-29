package com.lifetrace.backend.service;

import com.lifetrace.backend.model.Organ;
import com.lifetrace.backend.model.Recipient;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.resend.Resend;
import com.resend.services.emails.model.*;
import com.resend.services.emails.model.CreateEmailOptions;
@Service
@RequiredArgsConstructor
public class EmailService {

    // 🔥 RESEND CLIENT
    private final Resend resend = new Resend(System.getenv("RESEND_API_KEY"));

    // ===============================
    // COMMON SEND METHOD
    // ===============================
    private void sendEmail(String to, String subject, String html) {
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev") // default sender
                    .to(to)
                    .subject(subject)
                    .html(html)
                    .build();

            resend.emails().send(params);

            System.out.println("Email sent successfully to: " + to);

        } catch (Exception e) {
            System.out.println("Email failed for: " + to);
            e.printStackTrace();
        }
    }

    // ===============================
    // MATCH EMAIL
    // ===============================
    @Async
    public void sendHospitalMatchEmail(String email, Organ organ, Recipient recipient) {
        sendEmail(
                email,
                "LifeTrace - Organ Match Found",
                "<h3>Organ Match Found</h3>" +
                        "<p>Organ: " + organ.getOrganType() + "</p>" +
                        "<p>Blood Group: " + organ.getBloodGroup() + "</p>" +
                        "<p>Recipient ID: " + recipient.getId() + "</p>"
        );
    }

    // ===============================
    // DISPATCH
    // ===============================
    @Async
    public void sendDispatchEmail(String email, Long caseId) {
        sendEmail(
                email,
                "LifeTrace - Organ Dispatched",
                "<p>Case ID: " + caseId + "</p><p>Organ dispatched.</p>"
        );
    }

    // ===============================
    // RECEIVE
    // ===============================
    @Async
    public void sendReceiveEmail(String email, Long caseId) {
        sendEmail(
                email,
                "LifeTrace - Organ Received",
                "<p>Case ID: " + caseId + "</p><p>Organ received.</p>"
        );
    }

    // ===============================
    // SURGERY RESULT
    // ===============================
    @Async
    public void sendSurgeryResultEmail(String email, Long caseId, boolean success) {

        String result = success ? "SUCCESSFUL" : "FAILED";

        sendEmail(
                email,
                "LifeTrace - Surgery Result",
                "<p>Case ID: " + caseId + "</p><p>Result: " + result + "</p>"
        );
    }

    // ===============================
    // OTP
    // ===============================
    @Async
    public void sendOtpEmail(String email, String otp) {
        sendEmail(
                email,
                "LifeTrace - OTP",
                "<h2>Your OTP: " + otp + "</h2>"
        );
    }

    // ===============================
    // AUTH EMAILS
    // ===============================
    @Async
    public void sendRegistrationSuccessEmail(String email) {
        sendEmail(
                email,
                "Registration Successful",
                "<p>Your account is created successfully.</p>"
        );
    }

    @Async
    public void sendLoginAlertEmail(String email) {
        sendEmail(
                email,
                "Login Alert",
                "<p>You logged in successfully.</p>"
        );
    }

    // ===============================
    // HOSPITAL STATUS
    // ===============================
    @Async
    public void sendHospitalStatusEmail(String email, String status) {
        sendEmail(
                email,
                "Hospital Status Update",
                "<p>Your hospital is now: <b>" + status + "</b></p>"
        );
    }
}