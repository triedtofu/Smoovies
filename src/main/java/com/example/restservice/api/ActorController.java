package com.example.restservice.api;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.restservice.service.ActorService;
import com.example.restservice.service.MovieService;

@RestController
@RequestMapping("/api/actor")
public class ActorController {
    @Autowired
    private final MovieService movieService;

    @Autowired
    private final ActorService actorService;

    @Autowired
    public ActorController(MovieService movieService, ActorService actorService) {
        this.movieService = movieService;
        this.actorService = actorService;
    }

    @GetMapping("/getActor")
    public ResponseEntity<Object> getActor(@RequestParam(name = "id") Long id, @RequestParam(name = "token", required = false) String token) {
        JSONObject response = actorService.getActor(id, token);
        return ControllerResponses.generateHttpResponse(response);
    }
    
}
