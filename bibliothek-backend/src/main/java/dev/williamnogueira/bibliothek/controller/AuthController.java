package dev.williamnogueira.bibliothek.controller;

import dev.williamnogueira.bibliothek.domain.auth.AuthService;
import dev.williamnogueira.bibliothek.domain.auth.dto.register.RegisterResponseDto;
import dev.williamnogueira.bibliothek.domain.auth.dto.login.LoginRequestDto;
import dev.williamnogueira.bibliothek.domain.auth.dto.login.LoginResponseDto;
import dev.williamnogueira.bibliothek.domain.auth.dto.register.RegisterRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@RequestBody @Valid RegisterRequestDto registerRequest) {
        var createdUser = authService.register(registerRequest);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{registration}")
                .buildAndExpand(createdUser.registration())
                .toUri();

        return ResponseEntity.created(location).body(createdUser);
    }
}

