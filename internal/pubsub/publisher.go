package pubsub

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/pubsub"
)

type AgentMeshPublisher struct {
	client *pubsub.Client
	topic  *pubsub.Topic
}

func NewPublisher(ctx context.Context, projectID, topicID string) (*AgentMeshPublisher, error) {
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to create pubsub client: %w", err)
	}

	topic := client.Topic(topicID)

	topic.PublishSettings.DelayThreshold = 10 * 1000 * 1000 // 10ms
	topic.PublishSettings.CountThreshold = 100

	return &AgentMeshPublisher{
		client: client,
		topic:  topic,
	}, nil
}

func (p *AgentMeshPublisher) PublishQuery(ctx context.Context, userQuery string, traceID string) {
	asyncCtx := context.Background()

	go func() {
		result := p.topic.Publish(asyncCtx, &pubsub.Message{
			Data: []byte(userQuery),
			Attributes: map[string]string{
				"trace_id": traceID,
				"origin":   "portfolio_agent_mesh",
			},
		})

		id, err := result.Get(asyncCtx)
		if err != nil {
			log.Printf("[ERROR] Agent Mesh Sync failed: %v", err)
			return
		}
		log.Printf("[SUCCESS] Event %s published to Agent Mesh", id)
	}()
}

func (p *AgentMeshPublisher) Close() {
	p.topic.Stop()
	p.client.Close()
}
