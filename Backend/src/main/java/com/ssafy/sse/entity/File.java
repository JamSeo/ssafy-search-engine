package com.ssafy.sse.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name="file")
public class File {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long seq;

	@Lob
	@Column(name="file_location", nullable= false)
	private String fileLocation;

	@CreatedDate
	private LocalDateTime createDate;

	@Column(name="result")
	private String result;

	@Column(name="summarized_result")
	private String summary;

	@Column(name="translated_result")
	private String trans;

	@Column(name="email")
	private String email;

}