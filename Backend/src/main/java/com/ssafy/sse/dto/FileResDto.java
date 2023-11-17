package com.ssafy.sse.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileResDto {
	private String fileLocation;
	private LocalDateTime createDate;
	private String result;
}