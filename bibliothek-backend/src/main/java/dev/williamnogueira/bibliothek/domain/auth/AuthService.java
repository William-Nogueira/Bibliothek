package dev.williamnogueira.bibliothek.domain.auth;

import dev.williamnogueira.bibliothek.domain.auth.dto.register.RegisterRequestDto;
import dev.williamnogueira.bibliothek.domain.auth.dto.register.RegisterResponseDto;
import dev.williamnogueira.bibliothek.domain.user.UserEntity;
import dev.williamnogueira.bibliothek.domain.user.UserService;
import dev.williamnogueira.bibliothek.infrastructure.security.TokenService;
import dev.williamnogueira.bibliothek.domain.auth.dto.login.LoginRequestDto;
import dev.williamnogueira.bibliothek.domain.auth.dto.login.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public LoginResponseDto login(LoginRequestDto loginRequest) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(loginRequest.registration(), loginRequest.password());
        var auth = authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((UserEntity) auth.getPrincipal());

        return new LoginResponseDto(token);
    }

    @Transactional
    public RegisterResponseDto register(RegisterRequestDto registerRequest) {
        var encryptedPassword = new BCryptPasswordEncoder().encode(registerRequest.password());
        var newUser = UserEntity.builder()
                .registration(registerRequest.registration())
                .name(registerRequest.name())
                .password(encryptedPassword)
                .roles(registerRequest.roles())
                .build();

        return userService.create(newUser);
    }
}
