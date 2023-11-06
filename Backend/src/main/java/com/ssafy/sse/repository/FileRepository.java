package com.ssafy.sse.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sse.entity.File;

@Repository
@Transactional
public interface FileRepository extends JpaRepository<File, Long> {
	List<File> findAllByEmail(String email);

	@Query(value = "SELECT * from file where email = :email and createDate between :start  and :end ", nativeQuery = true)
	List<File>findAllByEmailAndDateBetween(LocalDateTime start, LocalDateTime end, String email);
	@Query(value = "SELECT * from file where email = :email and  DATE_FORMAT(createDate, '%Y-%m-%d') = :date", nativeQuery = true)
	List<File>findAllByEmailAndDate(String date, String email);

	@Query(value = "UPDATE url o SET o.dest = :dest where o.id = 1", nativeQuery = true)
	int updateDest(@Param(value="dest") String dest);
}