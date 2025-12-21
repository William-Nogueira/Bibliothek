package dev.williamnogueira.bibliothek.domain.user;

import dev.williamnogueira.bibliothek.domain.auth.dto.register.RegisterResponseDto;
import dev.williamnogueira.bibliothek.domain.user.exceptions.UserAlreadyExistsException;
import dev.williamnogueira.bibliothek.domain.user.dto.UserRequestDto;
import dev.williamnogueira.bibliothek.domain.user.dto.UserResponseDto;
import dev.williamnogueira.bibliothek.domain.user.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.util.Objects.nonNull;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponseDto findByRegistration(String registration) {
        var user = getEntity(registration);
        return new UserResponseDto(user.getRegistration(), user.getName(), user.getProfilePic());
    }

    @Transactional
    public RegisterResponseDto create(UserEntity newUser) {
        if (userRepository.existsByRegistration(newUser.getRegistration())) {
            throw new UserAlreadyExistsException("User already exists with registration " + newUser.getRegistration());
        }

        userRepository.save(newUser);
        return new RegisterResponseDto(newUser.getRegistration(), newUser.getName());
    }

    @Transactional
    public UserResponseDto updateById(String registration, UserRequestDto updatedUser) {
        var user = getEntity(registration);
        if (nonNull(updatedUser.registration())) {
            user.setRegistration(updatedUser.registration());
        }

        if (nonNull(updatedUser.name())) {
            user.setName(updatedUser.name());
        }

        if (nonNull(updatedUser.password())) {
            user.setPassword(new BCryptPasswordEncoder().encode(updatedUser.password()));
        }

        if (nonNull(updatedUser.profilePic())) {
            user.setProfilePic(updatedUser.profilePic());
        }

        userRepository.save(user);
        return new UserResponseDto(user.getRegistration(), user.getName(), user.getProfilePic());
    }

    @Transactional
    public void deleteById(String registration) {
        var user = getEntity(registration);
        userRepository.delete(user);
    }

    public UserEntity getEntity(String registration) {
        return userRepository.findByRegistration(registration)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
}
