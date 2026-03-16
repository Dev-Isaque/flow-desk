package br.com.api.flowDesk.repository.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.api.flowDesk.model.user.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID> {

    Optional<UserModel> findByEmail(String email);

    List<UserModel> findByNameContainingIgnoreCase(String name);

}