package com.ssafy.sse.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileDto {
	private String fileType;
	private String fileLocation;
	private String result;
}
