package sgu.com.sgualnr10b.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sgu.com.sgualnr10b.model.UserModel;

public interface UserRepository extends JpaRepository<UserModel, Long> {
}
