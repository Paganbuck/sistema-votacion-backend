package com.sistema_votacion.app.repositories;

import com.sistema_votacion.app.models.VotanteRegistrado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotanteRegistradoRepository extends JpaRepository<VotanteRegistrado, String> {
    // Al heredar de JpaRepository, Spring ya nos da métodos como .existsById() y .save() de forma automática
}