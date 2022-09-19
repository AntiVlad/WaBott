import numpy as np
import speech_recognition as sr
import transformers


nlp = transformers.pipeline("conversational", 
                            model="microsoft/DialoGPT-medium")

input_text = "hello!"
nlp(transformers.Conversation(input_text), pad_token_id=50256)

# class ChatBot():
#     def __init__(self, name):
#         print("----- starting up", name, "-----")
#         self.name = name

# if __name__ == "__main__":
#      ai = ChatBot(name="Dev")
#      while True:
#         ai.speech_to_text()
    
    #speech to text
# r = sr.Recognizer()
# with sr.Microphone() as source:
#     print("Say something!")
#     audio = r.listen(source)
#     print(audio)