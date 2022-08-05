package com.example.restservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

// Refrenced from https://github.com/arjungautam1/SpringBootEmail
/**
 * Service for Email sending that performs backend operations dependent on REST API calls
 */
@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends an email to a user
     * @param toEmail Email to send to
     * @param subject Subject of the email
     * @param body Body text of the email
     */
    public void sendEmail(String toEmail,
                                String subject,
                                String body
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("lawnchair3900help@gmail.com");
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);

    }

}

