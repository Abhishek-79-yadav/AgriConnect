package com.example.AgriConnect.controller;

import com.example.AgriConnect.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/image")
    public String uploadImage(
            @RequestParam MultipartFile file) {

        return cloudinaryService.uploadImage(file);
    }

    @PostMapping("/video")
    public String uploadVideo(
            @RequestParam MultipartFile file) {

        return cloudinaryService.uploadVideo(file);
    }

    @DeleteMapping("/{publicId}")
    public String delete(
            @PathVariable String publicId) {

        cloudinaryService.deleteFile(publicId);

        return "Deleted Successfully";
    }
}