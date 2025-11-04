package sgu.com.sgualnr10b.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import sgu.com.sgualnr10b.model.UserModel;
import sgu.com.sgualnr10b.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<UserModel> getUsers() {
        return repository.findAll();
    }

    public UserModel getUser(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public Optional<UserModel> findUser(Long id) {
        return repository.findById(id);
    }

    public UserModel createUser(UserModel user) {
        return repository.save(user);
    }

    public UserModel updateUser(Long id, UserModel data) {
        UserModel user = getUser(id);
        user.setFullName(data.getFullName());
        user.setEmail(data.getEmail());
        user.setPhoneNumber(data.getPhoneNumber());
        return repository.save(user);
    }

    public void deleteUser(Long id) {
        UserModel user = getUser(id);
        repository.delete(user);
    }
}
