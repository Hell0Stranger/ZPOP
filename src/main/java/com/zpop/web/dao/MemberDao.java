package com.zpop.web.dao;

import com.zpop.web.entity.Member;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MemberDao {

	List<Member> getList(int size, int offset, String keyword, String option);

	Member get(int id);

	Member getById(int id);

	Member getBySocialId(String socialId);

	Member getByNickname(String nickname);

	int insert(Member member);

	int update(Member member);

	int count(int socialTypeId);
}