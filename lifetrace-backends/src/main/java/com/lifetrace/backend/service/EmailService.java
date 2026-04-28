package com.lifetrace.backend.service;

import com.lifetrace.backend.model.Organ;
import com.lifetrace.backend.model.Recipient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // ===============================
    // MATCH EMAIL
    // ===============================
    @Async
    public void sendHospitalMatchEmail(String email, Organ organ, Recipient recipient) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("LifeTrace - Organ Match Found");
            mail.setText(
                    "Organ Match Found!\n\n" +
                            "Organ: " + organ.getOrganType() + "\n" +
                            "Blood Group: " + organ.getBloodGroup() + "\n" +
                            "Recipient ID: " + recipient.getId()
            );
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Match email failed");
        }
    }

    // ===============================
    // DISPATCH
    // ===============================
    @Async
    public void sendDispatchEmail(String email, Long caseId) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("LifeTrace - Organ Dispatched");
            mail.setText("Case ID: " + caseId + "\nOrgan dispatched.");
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Dispatch email failed");
        }
    }

    // ===============================
    // RECEIVE
    // ===============================
    @Async
    public void sendReceiveEmail(String email, Long caseId) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("LifeTrace - Organ Received");
            mail.setText("Case ID: " + caseId + "\nOrgan received.");
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Receive email failed");
        }
    }

    // ===============================
    // SURGERY RESULT
    // ===============================
    @Async
    public void sendSurgeryResultEmail(String email, Long caseId, boolean success) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("LifeTrace - Surgery Result");

            String result = success ? "SUCCESSFUL" : "FAILED";

            mail.setText("Case ID: " + caseId + "\nResult: " + result);
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Surgery email failed");
        }
    }

    // ===============================
    // OTP
    // ===============================
    @Async
    public void sendOtpEmail(String email, String otp) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("LifeTrace - OTP");
            mail.setText("Your OTP: " + otp);
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("OTP email failed");
        }
    }

    // ===============================
    // AUTH EMAILS
    // ===============================
    @Async
    public void sendRegistrationSuccessEmail(String email) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("Registration Successful");
            mail.setText("Your account is created successfully.");
            mailSender.send(mail);
        } catch (Exception e) {}
    }

    @Async
    public void sendLoginAlertEmail(String email) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("Login Alert");
            mail.setText("You logged in successfully.");
            mailSender.send(mail);
        } catch (Exception e) {}
    }

    // ===============================
    // HOSPITAL STATUS
    // ===============================
    @Async
    public void sendHospitalStatusEmail(String email, String status) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(email);
            mail.setSubject("Hospital Status Update");
            mail.setText("Your hospital is now: " + status);
            mailSender.send(mail);
        } catch (Exception e) {}
    }
}