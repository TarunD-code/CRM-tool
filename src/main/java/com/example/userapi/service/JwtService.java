package com.example.userapi.service;

import com.example.userapi.entity.User;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class JwtService {
    private final String jwtSecret = "your_jwt_secret_key";
    private final long jwtExpirationMs = 86400000;

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("name", user.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
} 