package com.lifetrace.backend.service;

import com.lifetrace.backend.controller.HospitalDonorResponse;
import com.lifetrace.backend.dto.HospitalProfileResponse;
import com.lifetrace.backend.dto.RegisterOrganRequest;
import com.lifetrace.backend.dto.Response;
import com.lifetrace.backend.exception.BadRequestException;
import com.lifetrace.backend.exception.ResourceNotFoundException;
import com.lifetrace.backend.model.*;
import com.lifetrace.backend.repository.*;
import com.lifetrace.backend.util.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final OrganService organService;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final IpfsService ipfsService;
    private final DonorRepository donorRepository;
    private final OrganRepository organRepository;          // NEW
    private final RecipientRepository recipientRepository;  // NEW

    // =========================================================
    // 1️⃣ MULTI ORGAN REGISTRATION
    // =========================================================
    public List<Organ> registerOrgan(RegisterOrganRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital profile not found"));

        if (!hospital.isApproved()) {
            throw new RuntimeException("Hospital not approved by admin");
        }

        if (hospital.isBlocked()) {
            throw new RuntimeException("Hospital is blocked by admin");
        }

        Donor donor = donorRepository.findById(request.getDonorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        if (!donor.isDeceased()) {
            throw new RuntimeException("Donor is not marked as deceased.");
        }

        return organService.registerOrgan(request);
    }

    // =========================================================
    // 2️⃣ PROFILE CREATION WITH LICENSE
    // =========================================================
    public String createProfile(
            String hospitalName,
            String registrationNumber,
            String contactNumber,
            String address,
            MultipartFile licenseFile
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (hospitalRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Hospital profile already exists");
        }

        String ipfsHash = ipfsService.uploadFile(licenseFile);

        Hospital hospital = new Hospital();
        hospital.setHospitalName(hospitalName);
        hospital.setRegistrationNumber(registrationNumber);
        hospital.setContactNumber(contactNumber);
        hospital.setAddress(address);
        hospital.setEmail(email);
        hospital.setLicenseUrl(ipfsHash);
        hospital.setApproved(false);
        hospital.setBlocked(false);
        hospital.setUser(user);

        hospitalRepository.save(hospital);

        return "Profile submitted. Waiting for admin approval.";
    }

    // =========================================================
    // 3️⃣ UPLOAD DEATH CERTIFICATE
    // =========================================================
    public String uploadDeathCertificate(Long donorId, MultipartFile file) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hospital profile not found"));

        if (!hospital.isApproved()) {
            throw new RuntimeException("Hospital not approved by admin");
        }

        if (hospital.isBlocked()) {
            throw new RuntimeException("Hospital is blocked by admin");
        }

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        String ipfsHash = ipfsService.uploadFile(file);

        donor.setDeathCertificateUrl(ipfsHash);
        donor.setDeceased(true);
        donor.setDeclaredByHospitalId(hospital.getId());

        donorRepository.save(donor);

        return "Death certificate uploaded successfully. Donor marked as deceased.";
    }

    // =========================================================
    // 4️⃣ HOSPITAL DASHBOARD
    // =========================================================
    public Map<String, Object> getDashboard() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital profile not found"));

        Map<String, Object> data = new HashMap<>();

        data.put("totalOrgans", organRepository.countByHospital(hospital));
        data.put("availableOrgans", organRepository.countByHospitalAndStatus(hospital, "AVAILABLE"));
        data.put("allocatedOrgans", organRepository.countByHospitalAndStatus(hospital, "ALLOCATED"));

        data.put("totalRecipients", recipientRepository.countByHospital(hospital));
        data.put("waitingRecipients", recipientRepository.countByHospitalAndStatus(hospital, "WAITING"));
        data.put("matchedRecipients", recipientRepository.countByHospitalAndStatus(hospital, "MATCHED"));

        return data;
    }

    // =========================================================
    // 5️⃣ GET ALL ORGANS OF THIS HOSPITAL
    // =========================================================
    public List<Organ> getMyOrgans() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital profile not found"));

        return organRepository.findByHospital(hospital);
    }

    // =========================================================
    // 6️⃣ GET ALL RECIPIENTS OF THIS HOSPITAL
    // =========================================================
    public List<Recipient> getMyRecipients() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Hospital hospital = hospitalRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital profile not found"));

        return recipientRepository.findByHospital(hospital);
    }

//    search donor by addhar
public HospitalDonorResponse searchDonorByAadhaar(String aadhaarNumber) {

    if (!aadhaarNumber.matches("\\d{12}")) {
        throw new BadRequestException("Invalid Aadhaar number. Must be 12 digits.");
    }

    Donor donor = donorRepository.findByAadhaarNumber(aadhaarNumber)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Donor not found with Aadhaar: " + aadhaarNumber)
            );

    return HospitalDonorResponse.builder()
            .id(donor.getId())
            .name(donor.getName())
            .email(donor.getEmail())
            .aadhaarNumber(donor.getAadhaarNumber())
            .bloodGroup(donor.getBloodGroup())
            .organsConsented(donor.getOrgansConsented())
            .consentGiven(donor.isConsentGiven())
            .consentHash(donor.getConsentHash())
            .deceased(donor.isDeceased())
            .deathCertificateHash(donor.getDeathCertificateUrl())
            .organsRegistered(donor.isOrgansRegistered())
            .hospitalId(donor.getDeclaredByHospitalId())
            .build();
}

    public Response getHospitalProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Hospital hospital=hospitalRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("complete the hospital profile first")
        );
//        System.out.println(hospital.isEmpty());
        Response response = new Response();
        if (email==null) {
            response.setData("Hospital profile not found");
            response.setStatus(Status.FAIL);
        }else {
            HospitalProfileResponse hospitalProfileResponse = new HospitalProfileResponse();
            hospitalProfileResponse.setId(hospital.getId());
            hospitalProfileResponse.setHospitalName(hospital.getHospitalName());
            hospitalProfileResponse.setRegistrationNumber(hospital.getRegistrationNumber());
            hospitalProfileResponse.setContactNumber(hospital.getContactNumber());
            hospitalProfileResponse.setEmail(hospital.getEmail());
            hospitalProfileResponse.setAddress(hospital.getAddress());
            hospitalProfileResponse.setApproved(hospital.isApproved());
            hospitalProfileResponse.setBlocked(hospital.isBlocked());
            hospitalProfileResponse.setLicenseUrl(hospital.getLicenseUrl());
            hospitalProfileResponse.setUserID(hospital.getUser().getId());

            response.setData(hospitalProfileResponse);
            response.setStatus(Status.SUCCESS);
        }
        return  response;
    }

}