package br.com.api.flowDesk.config;

import java.security.Principal;
import java.util.List;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import br.com.api.flowDesk.service.auth.JwtService;

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    public WebSocketAuthChannelInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String header = firstNativeHeader(accessor, "Authorization");
            String token = extractBearerToken(header);
            if (token == null || !jwtService.isValid(token)) {
                throw new AccessDeniedException("Token inválido ou expirado");
            }

            String userId = jwtService.getUserId(token).toString();
            accessor.setUser(new UsernamePasswordAuthenticationToken(userId, null, List.of()));
            return message;
        }

        Principal principal = accessor.getUser();
        if (principal == null) {
            throw new AccessDeniedException("Conexão STOMP não autenticada");
        }

        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            if (destination != null && destination.startsWith("/topic/users/")) {
                String expected = "/topic/users/" + principal.getName() + "/notifications";
                if (!expected.equals(destination)) {
                    throw new AccessDeniedException("Sem permissão para esse canal de notificação");
                }
            }
        }

        return message;
    }

    private String firstNativeHeader(StompHeaderAccessor accessor, String name) {
        List<String> values = accessor.getNativeHeader(name);
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.getFirst();
    }

    private String extractBearerToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            return null;
        }
        return header.substring(7).trim();
    }
}
