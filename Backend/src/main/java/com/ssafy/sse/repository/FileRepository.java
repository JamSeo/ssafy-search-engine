package com.ssafy.sse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.sse.entity.File;

public interface FileRepository extends JpaRepository<File, Long> {
}