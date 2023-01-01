package com.zpop.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zpop.web.entity.comment.Comment;
import com.zpop.web.entity.comment.CommentView;
import com.zpop.web.security.ZpopUserDetails;
import com.zpop.web.service.CommentService;

@Controller
@RequestMapping("/")
public class CommentController {
	@Autowired
	private CommentService service;
	
	//댓글불러오기 AJAX endpoint (js에서 콜하는 함수)
	@GetMapping("comment")
	@ResponseBody
	public  Map<String, Object> getComment(@RequestParam int meetingId) {
		
		List<CommentView> comments = service.getComment(meetingId);
		int countOfComment = service.getCountOfComment(meetingId);
		
		Map<String,Object> dto = new HashMap<>();
		dto.put("status",200);
		dto.put("resultObject",comments);
		dto.put("countOfComment",countOfComment);
		
		return dto;
	}
	
	//답글불러오기 AJAX endpoint (js에서 콜하는 함수)
	@GetMapping("reply")
	@ResponseBody
	public  Map<String, Object> getReply(@RequestParam int groupId) {

		List<CommentView> replies = service.getReply(groupId);
		int countOfReply = service.getCountOfReply(groupId);
		
		Map<String,Object> dto = new HashMap<>();
		dto.put("status",200);
		dto.put("resultObject",replies);
		dto.put("countOfReply",countOfReply);
		
		return dto;
	}

	//댓글(=comment) 등록 AJAX endpoint (js에서 콜하는 함수)
	@PostMapping("comment")
	public  String registerComment(@RequestBody Comment comment, 
			@AuthenticationPrincipal ZpopUserDetails userDetails) {
		comment.setWriterId(userDetails.getId());
		service.registerComment(comment);
		return "comment/comment";
	}
	//답글(=reply) 등록 AJAX endpoint (js에서 콜하는 함수)
	@PostMapping("reply")
	public  String registerReply(@RequestBody Comment comment, 
			@AuthenticationPrincipal ZpopUserDetails userDetails) {
		comment.setWriterId(userDetails.getId());
		service.registerReply(comment);
		return "comment/reply";
	}
}
