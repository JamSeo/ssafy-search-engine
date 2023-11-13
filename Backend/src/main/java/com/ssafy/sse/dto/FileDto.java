package com.ssafy.sse.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileDto {
	private String fileLocation;
	private String translatedResult;
	private String summarizedResult;
	private String result;
}
