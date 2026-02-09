package com.lifetrace.backend.service;

import com.lifetrace.backend.model.Organ;
import com.lifetrace.backend.model.Recipient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendHospitalMatchEmail(
            String hospitalEmail,
            Organ organ,
            Recipient recipient
    ) {
        JavaMailSenderImpl impl = (JavaMailSenderImpl) mailSender;
        System.out.println("Sending mail to: " + hospitalEmail);
        System.out.println("SPRING HOST: " + impl.getHost());
        System.out.println("SPRING PORT: " + impl.getPort());
        System.out.println("SPRING USERNAME: " + impl.getUsername());
        System.out.println("SPRING PASSWORD: " + impl.getPassword());

        if (hospitalEmail == null || !hospitalEmail.contains("@")) {
            throw new RuntimeException("Invalid hospital email: " + hospitalEmail);
        }

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setFrom(fromEmail);
        System.out.println("FROM EMAIL: " + fromEmail);
        System.out.println(mailSender.getClass());
        mail.setTo(hospitalEmail);
        mail.setSubject("LifeTrace - Organ Match Found");

        mail.setText(
                "Organ Match Found!\n\n" +
                        "Organ: " + organ.getOrganType() + "\n" +
                        "Blood Group: " + organ.getBloodGroup() + "\n\n" +
                        "Recipient ID: " + recipient.getId() + "\n\n" +
                        "Please login to LifeTrace dashboard."
        );

        mailSender.send(mail);

        System.out.println("Mail sent successfully.");
    }
}