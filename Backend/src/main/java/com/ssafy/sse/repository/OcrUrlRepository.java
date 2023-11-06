package com.ssafy.sse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.sse.entity.OcrUrl;

@Repository
@Transactional
public interface OcrUrlRepository extends JpaRepository<OcrUrl, Long> {

	@Query(value = "SELECT dest FROM url ORDER BY createDate DESC LIMIT 1", nativeQuery = true)
	String findTopDest();
	@Modifying
	@Query(value = "UPDATE url o SET o.dest = :dest where o.id = 1", nativeQuery = true)
	int updateDest(@Param(value="dest") String dest);
}
