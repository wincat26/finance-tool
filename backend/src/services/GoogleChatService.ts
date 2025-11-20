import axios from 'axios';

export class GoogleChatService {
    private static webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;

    static async sendNewLeadNotification(lead: any) {
        if (!this.webhookUrl) {
            console.warn('⚠️ GOOGLE_CHAT_WEBHOOK_URL not set. Skipping notification.');
            return;
        }

        try {
            const message = {
                cards: [
                    {
                        header: {
                            title: '🎉 新潛在客戶 (New Lead)',
                            subtitle: lead.company || '個人客戶',
                            imageUrl: 'https://www.gstatic.com/images/icons/material/system/2x/person_add_black_48dp.png',
                            imageStyle: 'AVATAR'
                        },
                        sections: [
                            {
                                widgets: [
                                    {
                                        keyValue: {
                                            topLabel: '姓名',
                                            content: lead.name
                                        }
                                    },
                                    {
                                        keyValue: {
                                            topLabel: '來源',
                                            content: lead.source || '未指定'
                                        }
                                    },
                                    {
                                        keyValue: {
                                            topLabel: '聯絡方式',
                                            content: `${lead.phone || ''} ${lead.email || ''}`.trim() || '無'
                                        }
                                    },
                                    {
                                        buttons: [
                                            {
                                                textButton: {
                                                    text: '查看詳情',
                                                    onClick: {
                                                        openLink: {
                                                            url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/leads`
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            await axios.post(this.webhookUrl, message);
            console.log('✅ Google Chat notification sent.');
        } catch (error) {
            console.error('❌ Failed to send Google Chat notification:', error);
        }
    }
}
