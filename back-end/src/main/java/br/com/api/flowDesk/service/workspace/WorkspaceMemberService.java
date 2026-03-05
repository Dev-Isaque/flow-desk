package br.com.api.flowDesk.service.workspace;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.api.flowDesk.dto.workspace.dto.WorkspaceMemberDTO;
import br.com.api.flowDesk.repository.user.UserRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceMemberRepository;
import br.com.api.flowDesk.repository.workspace.WorkspaceRepository;

@Service
public class WorkspaceMemberService {

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    public List<WorkspaceMemberDTO> listMembers(UUID workspaceId) {

        var members = workspaceMemberRepository.findAllByWorkspace_Id(workspaceId);

        return members.stream()
                .map(member -> new WorkspaceMemberDTO(
                        member.getUser().getName(),
                        member.getUser().getEmail(),
                        member.getRole()))
                .toList();
    }
}
