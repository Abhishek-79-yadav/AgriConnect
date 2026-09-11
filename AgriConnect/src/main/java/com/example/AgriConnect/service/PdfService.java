package com.example.AgriConnect.service;

import com.example.AgriConnect.entity.Order;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.OrderRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final OrderRepository orderRepository;

    public byte[] generateInvoice(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        try {

            Document document = new Document();

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            PdfWriter.getInstance(document, out);

            document.open();

            Font title =
                    new Font(Font.HELVETICA,20,Font.BOLD);

            document.add(new Paragraph("AgriConnect Invoice",title));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Order ID : " + order.getId()));

            document.add(new Paragraph(
                    "Buyer : " + order.getBuyer().getName()));

            document.add(new Paragraph(
                    "Status : " + order.getStatus()));

            document.add(new Paragraph(
                    "Paid : " + order.isPaid()));

            document.add(new Paragraph(
                    "Total : ₹" + order.getTotalPrice()));

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed");
        }
    }

}