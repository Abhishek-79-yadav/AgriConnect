package com.example.AgriConnect.service;

import com.example.AgriConnect.dto.response.ProductVideoResponse;
import com.example.AgriConnect.entity.*;
import com.example.AgriConnect.exception.ResourceNotFoundException;
import com.example.AgriConnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final ProductVideoRepository videoRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/videos/";

    public ProductVideoResponse uploadVideo(Long productId,
                                            String title,
                                            MultipartFile file,
                                            String email) {

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String originalName = file.getOriginalFilename();
            String safeName = (originalName != null)
                    ? originalName.replace(" ", "_")
                    : "video.mp4";

            String fileName = UUID.randomUUID() + "_" + safeName;

            File destination = new File(dir, fileName);
            file.transferTo(destination);

            String fileUrl = "/videos/" + fileName;

            ProductVideo video = ProductVideo.builder()
                    .title(title)
                    .videoUrl(fileUrl)
                    .product(product)
                    .farmer(farmer)
                    .build();

            return mapToResponse(videoRepository.save(video));

        } catch (IOException e) {
            throw new ResourceNotFoundException("Video upload failed");
        }
    }

    public List<ProductVideoResponse> getByProduct(Long productId) {
        return videoRepository.findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProductVideoResponse> getByFarmer(Long farmerId) {
        return videoRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductVideoResponse mapToResponse(ProductVideo v) {
        return ProductVideoResponse.builder()
                .id(v.getId())
                .title(v.getTitle())
                .videoUrl(v.getVideoUrl())
                .productName(v.getProduct().getProductName())
                .farmerName(v.getFarmer().getName())
                .build();
    }
}