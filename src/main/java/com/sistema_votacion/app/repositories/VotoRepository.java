package com.sistema_votacion.app.repositories;

import com.sistema_votacion.app.models.Voto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotoRepository extends JpaRepository<Voto, Long> {
    boolean existsByIdentificadorVotante(String identificadorVotante);
    long countByCandidatoId(Long candidatoId);
}
