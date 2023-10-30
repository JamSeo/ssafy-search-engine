package com.ssafy.sse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.sse.entity.File;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
	List<File> findAllByEmail(String name);
}