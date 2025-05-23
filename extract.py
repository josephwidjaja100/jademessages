import sqlite3
import datetime

def get_chat_mapping(db_location):
    conn = sqlite3.connect(db_location)
    cursor = conn.cursor()

    cursor.execute("SELECT room_name, display_name FROM chat")
    result_set = cursor.fetchall()

    mapping = {room_name: display_name for room_name, display_name in result_set}

    conn.close()

    return mapping

def read_messages(db_location, n=10, self_number='Me', recipient='+9143833366', human_readable_date=True):
    conn = sqlite3.connect(db_location)
    cursor = conn.cursor()

    query = """
    SELECT message.ROWID, message.date, message.text, message.attributedBody, handle.id, message.is_from_me, message.cache_roomnames
    FROM message
    LEFT JOIN handle ON message.handle_id = handle.ROWID
    """

    if n is not None:
        query += f" ORDER BY message.date DESC LIMIT {n}"

    results = cursor.execute(query).fetchall()
    messages = []

    for result in results:
        rowid, date, text, attributed_body, handle_id, is_from_me, cache_roomname = result

        if handle_id is None:
            phone_number = self_number
        else:
            phone_number = handle_id

        if text is not None:
            body = text
        elif attributed_body is None:
            continue
        else:
            attributed_body = attributed_body.decode('utf-8', errors='replace')

            if "NSNumber" in str(attributed_body):
                attributed_body = str(attributed_body).split("NSNumber")[0]
                if "NSString" in attributed_body:
                    attributed_body = str(attributed_body).split("NSString")[1]
                    if "NSDictionary" in attributed_body:
                        attributed_body = str(attributed_body).split("NSDictionary")[0]
                        attributed_body = attributed_body[6:-12]
                        body = attributed_body

        if human_readable_date:
            date_string = '2001-01-01'
            mod_date = datetime.datetime.strptime(date_string, '%Y-%m-%d')
            unix_timestamp = int(mod_date.timestamp())*1000000000
            new_date = int((date+unix_timestamp)/1000000000)
            date = datetime.datetime.fromtimestamp(new_date).strftime("%Y-%m-%d %H:%M:%S")

        mapping = get_chat_mapping(db_location)

        try:
            mapped_name = mapping[cache_roomname]
        except:
            mapped_name = None

        if(phone_number == recipient):
            messages.append({"rowid": rowid, "date": date, "body": body, "phone_number": phone_number, "is_from_me": is_from_me,
             "cache_roomname": cache_roomname, 'group_chat_name' : mapped_name})

    conn.close()
    return messages

def print_messages(messages):
    with open("texts.txt", "w") as file:
        for message in messages:
            file.write(f"Body: {message['body']} ")
            file.write(f"Phone Number: {message['phone_number']} ")
            file.write(f"Is From Me: {message['is_from_me']} ")
            file.write(f"Date: {message['date']}")
            file.write("\n")

chat_db = "/Users/josephwidjaja/Library/Messages/chat.db"
self_number = "+14126564693"
recipient = "+19143833366"
n = 300000

messages = read_messages(chat_db, n=n, self_number=self_number, recipient=recipient, human_readable_date=True)

print_messages(messages)